import {ProductFilterPage} from "@/components/ProductFilterPage";

import { Suspense } from 'react';

export default function ProductTagPage({ params }: { params: { tag: string } }) {
  return (
    <main className="container mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductFilterPage tag={params.tag} />
      </Suspense>
    </main>
  );
}