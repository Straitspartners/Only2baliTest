useEffect(() => {
    axios.get('http://192.168.1.9/api/users/register') // Use backend device IP here
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            console.log('Error fetching data: ', error);
        });
}, []);
