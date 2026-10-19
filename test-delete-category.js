
async function testDeleteCategory() {
    try {
        const response = await fetch('http://127.0.0.1:1234/api/categories/6', {
            method: 'DELETE'
        });

        const result = await response.json();

        console.log('HTTP Status:', response.status);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Request failed:', error);
    }
}

testDeleteCategory();
