import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// const url = 'https://vue3-course-api.hexschool.io/v2';
// const path = 'cliffwu-vueapi';




let productModal = null;
let delProductModal = null;


createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'cliffwu-vueapi',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    methods: {
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then((res) => {
                    console.log('驗證成功');
                    // !!!!驗證成功才從這裡取得資料
                    this.getData();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    console.log('驗證失敗');
                    window.location = 'login_week3.html';//驗證失敗轉址退回
                })
        },
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;//有分頁的(為了第四周)
            axios.get(url).then((res) => {
                this.products = res.data.products;
            }).catch((err) => {
                alert(err.response.data.message);
            })
        },

        //確認按鈕 -濃縮更新、新增兩個的確認鍵
        updateProduct() {
            //新增post
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';//方法

            //更新後put
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }
            
            axios[http](url, { data: this.tempProduct })
                .then((response) => {
                    console.log(response);
                    alert(response.data.message);
                    this.getData();//如果成功了，就重新呼叫載入最新狀態的產品列表
                    productModal.hide();//新增成功後關掉
                    this.tempProduct = {};//清除輸入框
            })
                .catch((err) => {
                    alert(err.response.data.message);
            })
        },
        openModal(isNew, item) {
            // console.log('成功');
            //編輯-與getData()、updateProduct()，藉由判斷式來區分共用
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...item };
                if(!Array.isArray(this.tempProduct.imagesUrl)){
                    this.tempProduct.imagesUrl = [];
                }
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show()
            }
        },
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then((response) => {
                    alert(response.data.message);
                    delProductModal.hide();
                    this.getData();
            })
                .catch((err) => {
                    alert(err.response.data.message);
            })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },
    //生命週期(初始化，可以用的全域的東西)
    mounted() {
        // console.log(text);
        //取出cookie中的token
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)cliffToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        // 把cookie存在axios預設裡面，就不用重複帶入token來驗證
        axios.defaults.headers.common['Authorization'] = token;
        this.checkAdmin();//在進入頁面後呼叫驗證

        //modal開啟 bs 用id
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });

    },


}).mount('#app');