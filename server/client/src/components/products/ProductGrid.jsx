import ProductCard from './ProductCard';
import Loader from '../common/Loader';

export default function ProductGrid({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}
