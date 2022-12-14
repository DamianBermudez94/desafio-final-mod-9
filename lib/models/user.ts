import { adminFirestore } from "lib/firebase";

const collection = adminFirestore.collection("users");
export class User {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }

  //crea un nuevo user en la db
  static async createNewUser(data) {
    const userSnap = await collection.add(data);
    const newUser = new User(userSnap.id);
    newUser.data = data;
    return newUser;
  }
}