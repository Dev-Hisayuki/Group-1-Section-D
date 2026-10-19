
const categoryModel = require('./models/category.model');

async function testCreate() {
    try {
        const category = await categoryModel.create({
            category_name: 'Computer Studies',
            description: 'Books about computers and information technology',
            status: 'Active'
        });

        console.log('Category created successfully:');
        console.log(category);
    } catch (error) {
        console.error('Category model test failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('SQL message:', error.sqlMessage);
        console.error('SQL state:', error.sqlState);
    } finally {
        process.exit();
    }
}

testCreate();
