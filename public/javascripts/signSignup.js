const container = document.querySelector('#container');
        const registerBtn = document.querySelector('#register');
        const loginBtn = document.querySelector('#login');
        const cur=document.querySelector('.cursor');
        const main=document.querySelector('body');

        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });

        main.addEventListener('mousemove',(e)=>{
            cur.style.left=e.x+'px';
            cur.style.top=e.y+'px';
        });
