import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js'

const url = 'https://vue3-course-api.hexschool.io/v2';

const app = createApp({
    data() {
        return {
            //post表單要求的header要夾帶的格式
            user: {
                username: '',
                password: '',
            },
            // text:'231',
        }
    },
    methods: {
        login() {
            const api = `${url}/admin/signin`
            // console.log(api);
            // console.log(axios);
            axios.post(api, this.user)
                .then(res => {
                    // console.log('成功');
                    console.log(res);
                    //解構，把時間戳記跟token(金鑰)取出來然後存在cookie上面
                    const { token, expired } = res.data;
                    // console.log(token, expired);
                    document.cookie = `cliffToken=${token} ; expires=${new Date(expired)} `;
                    window.location = 'products_week3.html'//轉址;
                })
                .catch((err) => {
                    console.dir(err)
                    console.log(err);
                    alert('失敗');
                })
        }
    },
    mounted() {
        // console.log(this.text);
    },
});
app.mount('#app')