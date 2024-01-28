import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  DocumentData,
  Firestore,
  doc,
  getDoc,
  limit,
  QueryConstraint,
  collectionGroup,
  collection,
  getDocs,
  setDoc,
  query,
  addDoc,
} from '@angular/fire/firestore';
import { BaseModel } from './base-model';

/**
 * Base data service class. Must be extended with the type of data as generic type.
 */
@Injectable()
export abstract class BaseDataService<T extends BaseModel> {
  private readonly docs: Map<T, DocumentReference<DocumentData>> = new Map();

  protected readonly firestore = inject(Firestore);

  /**
   * Get document from specified path.
   * @param path Path to the document
   * @returns The value of the document
   */
  async getDoc(path: string): Promise<T> {
    const docRef = doc(this.firestore, path);
    const value = (await getDoc(docRef)).data() as T;

    this.docs.set(value, docRef);

    value._id = docRef.id;
    return value;
  }

  /**
   * Get single document from collection (if multiple are found, only the first one is returned).
   * @param path Path to the collection
   * @returns The value of the single document
   */
  async getSingleDoc(path: string, isGroup: boolean = false): Promise<T> {
    return (await this.queryDocs(path, isGroup, limit(1)))[0];
  }

  /**
   * Get all documents from collection.
   * @param path Path to the collection
   * @returns Values of fetched documents
   */
  async getDocs(path: string, isGroup: boolean = false): Promise<T[]> {
    return await this.queryDocs(path, isGroup);
  }

  /**
   * Query documents from specified path with constraints.
   * @param path Path to the collection to query
   * @param constraints Constraints to be applied to the query
   * @returns Values of fetched documents
   */
  async queryDocs(
    path: string,
    isGroup: boolean,
    ...constraints: QueryConstraint[]
  ): Promise<T[]> {
    const collectionRef = isGroup
      ? collectionGroup(this.firestore, path)
      : collection(this.firestore, path);

    const docsQuery = query(collectionRef, ...constraints);
    const queryResult = await getDocs(docsQuery);

    return queryResult.docs.map((doc) => {
      const value = doc.data() as T;
      this.docs.set(value, doc.ref);
      value._id = doc.id;
      return value;
    });
  }

  /**
   * Set document by its value.
   * @param value Value of the document to be set
   */
  async setDoc(value: T): Promise<void> {
    const docRef = this.docs.get(value);
    if (docRef) {
      await setDoc(docRef, value);
    }
  }

  /**
   * Create and register a new document.
   * @param path Path to the collection.
   * @param value Value of the document.
   */
  async addDoc(path: string, value: T): Promise<string> {
    const collectionRef = collection(this.firestore, path);
    const docRef = await addDoc(collectionRef, value);
    this.docs.set(value, docRef);
    value._id = docRef.id;
    return docRef.id;
  }

  /**
   * Get document reference from value.
   * @param value Value to fetch the document reference.
   * @returns The document reference (if found).
   */
  getDocRef(value: T): DocumentReference<DocumentData> | undefined {
    return this.docs.get(value);
  }
}
