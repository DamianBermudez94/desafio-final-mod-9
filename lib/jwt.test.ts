import test from "ava";
import { generate, decode } from "./jwt";

test("jwt encode/decode", (t) => {
  const payload = { dami: true };
  console.log("soy el payload",payload);
  
  const token = generate(payload);
  console.log("soy el token",token);
  
  const decoded = decode(token);
  console.log("soy el decoded",decoded);
  delete decoded.iat;
  t.deepEqual(payload, decoded);
});