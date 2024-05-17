import { Suspense } from "react";
import ThankYou from "./ThankYou";

export default async function Page() {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
}
