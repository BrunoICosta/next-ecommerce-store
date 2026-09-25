import { ProductArt } from "@/features/catalog/components/product-art";
import { getAllProducts } from "@/features/catalog";

export default function HomePage() {
  const products = getAllProducts();
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Loja em construção</h1>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <li key={product.id} className="overflow-hidden rounded-xl">
            <ProductArt
              category={product.category}
              color={product.colors[0]}
              view={(index % 3) as 0 | 1 | 2}
              label={product.name}
              className="aspect-[4/5] w-full"
            />
            <p className="mt-2 text-sm">{product.name}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
