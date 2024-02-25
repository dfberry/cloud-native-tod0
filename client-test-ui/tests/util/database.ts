export async function clearDatabase(apiUrl: string) {
    const url = `http://localhost:3000/todos`
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      console.log('Error clearing database: ', response.statusText);
    }
  }