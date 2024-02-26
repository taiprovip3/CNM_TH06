const express = require('express');// Khai báo thư viện express vào biến `express`
const app = express();// Khởi tạo biến `app` đại diện cho ứng dụng sẽ chạy
let data = require('./data');// Gọi mảng data để lát nữa push và pop phần tử
const multer = require('multer');
const upload = multer();// Khai báo middleware để xử lý dữ liệu từ form đưa lên

app.use(express.static('./templates'));
app.set('view engine', 'ejs');// Khai báo rằng app sẽ dùng engine EJS để render trang web
app.set('views', './templates');// Nội dung render trang web sẽ nằm trong thư mục tên `templates`

app.get('/', (req, res) =>{
    return res.render('index', { data: data });// Dùng biến response để render trang `index.ejs` đồng thời truyền biến `data`
});

app.post('/save', upload.fields([]), (req, res) =>{// Thêm middleware multerupload để chỉnh định rằng chấp nhận xử lý mọi field dữ liệu gởi từ form.
    const maSanPham = Number(req.body.maSanPham);// Lấy ra các tham số từ body của form
    const tenSanPham = req.body.tenSanPham;// Lấy ra các tham số từ body của form
    const soLuong  = Number(req.body.soLuong);// Lấy ra các tham số từ body của form

    const params = {
        "maSanPham": maSanPham,
        "tenSanPham": tenSanPham,
        "soLuong": soLuong
    };

    data.push(params);// Đẩy object data vào mảng

    return res.redirect('/');// Gọi render lại trang index (để cập nhật dữ liệu table)
});

app.post('/delete', upload.fields([]), (req, res) => {
    const listCheckboxSelected = Object.keys(req.body);// Lấy ra tất cả checkboxes
    //req.body trả về 1 object chứa các cặp key & value định dạng:
    // '123456': 'on',
    // '123458': 'on',
    //listCheckboxSelected trả về 1 array: [ '123456', '123458', '96707133' ]
    if(listCheckboxSelected.length <= 0){
        return res.redirect('/');
    } 
    function onDeleteItem(length){// Định nghĩa hàm đệ quy xóa
        const maSanPhamCanXoa = Number(listCheckboxSelected[length]);// Lấy ra maSP cần xóa

        data = data.filter(item => item.maSanPham !== maSanPhamCanXoa);// Dùng hàm filter hoặc .split, hoặc nhiều cách khác để xóa mảng.
        if(length > 0) {
            console.log('Data deleted:: ', JSON.stringify(data));
            onDeleteItem(length - 1);
        } else // Nếu length = 0 tức là không còn gì trong listCheckBox để xóa -> Render lại trang index để cập nhật data.
            return res.redirect('/');
    }
    onDeleteItem(listCheckboxSelected.length - 1);// Gọi hàm đệ quy xóa
});

app.listen(3000, () =>{// Chạy app ở port 3000
    console.log('Running in port 3000..');
});