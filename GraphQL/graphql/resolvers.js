import products from '../src/data/products.js';
import Product from '../models/Product.js';
export const resolvers = {
    Query: {
        products: async () => await Product.find(),
        product: async (_ , { id }) => await Product.findById(id),
    },
    Mutation: {
        addProduct: async (_, args) => {
            const newProduct = new Product(args);
            return await newProduct.save();
        },
        // deleteProduct: (_, {id}) =>{
        //     const productIndex = products.findIndex(product => product.id === id);
        //     if (productIndex === -1) {
        //         return false;
        //     }
        //     products.splice(productIndex, 1);
        //     return true;
        // },
        // updateProduct: (_, { id, title, category, price, inStock }) => {
        //     const index = products.findIndex(product => product.id === id);
        //     if (index === -1) {
        //         throw new Error("Product not found");
        //     }
        //     const updatedProduct = {
        //         ...products[index],
        //         title: title !== undefined ? title : products[index].title,
        //         category: category !== undefined ? category : products[index].category,
        //         price: price !== undefined ? price : products[index].price,
        //         inStock: inStock !== undefined ? inStock : products[index].inStock,
        //     };
        //     products[index] = updatedProduct;
        //     return updatedProduct;
        // }
        updateProduct: async (_, {...updatedProduct}) => {
            return await Product.findByIdAndUpdate(
                updatedProduct.id,
                updatedProduct,
                { new: true }
            );
        },
        deleteProduct: async (_, { id }) => {
            return await Product.findByIdAndDelete(id);
        },
    }
};
