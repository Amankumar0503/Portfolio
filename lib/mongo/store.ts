import { ObjectId, type Document } from "mongodb";
import { getDb } from "./client";

type Row = Document & {
  _id: string | ObjectId;
};

export const collections = {
  projects: "projects",
  skills: "skills",
  timeline: "timeline",
  about: "about",
  social: "social",
  messages: "messages",
} as const;

const ABOUT_DOC_ID = "profile";

function withoutId(data: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "id" || key === "_id" || value === undefined) continue;
    payload[key] = value;
  }
  return payload;
}

function asObjectId(id: string) {
  if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
    return new ObjectId(id);
  }
  return id;
}

function serialize<T>(doc: Row): T {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest } as T;
}

export async function listDocs<T>(collection: string): Promise<T[]> {
  const db = await getDb();
  const docs = await db.collection<Row>(collection).find().toArray();
  return docs.map((doc) => serialize<T>(doc));
}

export async function getDocById<T>(
  collection: string,
  id: string
): Promise<T | null> {
  const db = await getDb();
  const doc = await db.collection<Row>(collection).findOne({ _id: asObjectId(id) });
  if (!doc) return null;
  return serialize<T>(doc);
}

export async function createDoc<T>(
  collection: string,
  data: Record<string, unknown>
): Promise<T> {
  const db = await getDb();
  const now = new Date().toISOString();
  const payload = withoutId({
    ...data,
    created_at: (data.created_at as string | undefined) ?? now,
    updated_at: now,
  });
  const result = await db.collection<Row>(collection).insertOne(payload as Row);
  return { id: String(result.insertedId), ...payload } as T;
}

export async function updateDocById<T>(
  collection: string,
  id: string,
  data: Record<string, unknown>
): Promise<T | null> {
  const db = await getDb();
  const payload = withoutId({
    ...data,
    updated_at: new Date().toISOString(),
  });
  delete payload.created_at;

  const doc = await db.collection<Row>(collection).findOneAndUpdate(
    { _id: asObjectId(id) },
    { $set: payload },
    { returnDocument: "after" }
  );

  if (!doc) return null;
  return serialize<T>(doc);
}

export async function deleteDocById(collection: string, id: string) {
  const db = await getDb();
  await db.collection<Row>(collection).deleteOne({ _id: asObjectId(id) });
}

export async function getAbout<T>(): Promise<T | null> {
  return getDocById<T>(collections.about, ABOUT_DOC_ID);
}

export async function saveAbout<T>(data: Record<string, unknown>): Promise<T> {
  const db = await getDb();
  const now = new Date().toISOString();
  const payload = withoutId({
    ...data,
    updated_at: now,
  });

  await db.collection<Row>(collections.about).updateOne(
    { _id: ABOUT_DOC_ID },
    {
      $set: payload,
      $setOnInsert: { created_at: now },
    },
    { upsert: true }
  );

  const saved = await getAbout<T>();
  if (!saved) {
    throw new Error("Failed to save about profile");
  }
  return saved;
}

export function byDisplayOrder<T extends { display_order?: number }>(items: T[]) {
  return [...items].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );
}

export function byCreatedAtDesc<T extends { created_at?: string }>(items: T[]) {
  return [...items].sort((a, b) =>
    (b.created_at ?? "").localeCompare(a.created_at ?? "")
  );
}
