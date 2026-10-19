
async function testCreateCategory() {
    try {
        const response = await fetch('http://127.0.0.1:1234/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category_name: 'Mathematics',
                description: 'Mathematics reference books',
                status: 'Active'
            })
        });

        const result = await response.json();

        console.log('HTTP Status:', response.status);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Request failed:', error);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
    }
}

testCreateCategory();
