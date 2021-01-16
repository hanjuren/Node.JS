//사용자 로딩
async function gerUser() {
    try{
        const res = await axios.get('/users');
        const users = res.data;
        console.log(users);
        const tbody = document.querySelector('#user-list tbody');
        tbody.innerHTML = '';
        users.map(function (user) {
            const row = document.createElement('tr');
            row.addEventListener('click', () => {
                getComment(user.id);
            });

            //로우 추가
            let td = document.createElement('td');
            td.textContent = user.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.age;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.address;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.married ? '기혼' : '미혼';
            row.appendChild(td);
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}

//사용자 등록
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const age = e.target.age.value;
    const address = e.target.address.value;
    const married = e.target.married.checked;
    if(!name) {
        return alert('이름을 입력해주세요');
    }
    try{
        await axios.post('/users', { name, age, address, married });
        getUser();
    } catch (err) {
        console.error(err);
    }
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.address.value = '';
    e.target.married.checked = false;
});