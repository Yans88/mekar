import axios from "axios";
import moment from 'moment';
import "moment/locale/id";

const API_URL = process.env.REACT_APP_URL_API;
const CryptoJS = require("crypto-js");
const secretKey = process.env.REACT_APP_SECRET_KEY;
const tokenLogin = process.env.REACT_APP_TOKEN_LOGIN;

export const loginAdmin = async (username, pass) => {
    const param = {
        username: username,
        pass: pass
    };
    let token = '';
    await axios.post(API_URL + '/login_admin', param).then(res => {
        const response = res.data;
        if (response.err_code === '00') {
            let data = response.data;
            let id_admin = data.id_operator;
            let name = data.name;
            let tgl = new Date();
            const _token = id_admin + 'Þ' + name + 'Þ' + tgl;
            token = CryptoJS.AES.encrypt(_token, secretKey).toString();
        } else {
            token = '';
        }
    });
    return token;
}

export const GetProfileAdmin = async () => {
    //const history = useHistory();
    const token = localStorage.getItem(tokenLogin);
    const dt = CryptoJS.AES.decrypt(token, secretKey);
    const dt_res = dt.toString(CryptoJS.enc.Utf8);
    const _dt = dt_res.split('Þ');
    let tgl_expired = moment(new Date(_dt[2]), 'DD-MM-YYYY HH:mm', true).format();
    let tgl_now = moment(new Date(), 'DD-MM-YYYY HH:mm', true).format();
    var diffMinutes = moment(tgl_now).diff(moment(tgl_expired), 'minutes');
    console.log(diffMinutes);
    let dt_user = {
        id_operator: null,
        name: '',
        password: null
    };
    if (diffMinutes >= 120) {
        localStorage.removeItem(tokenLogin);        
        return dt_user;
    } else {
        const param = {
            id_admin: _dt[0],
            cms: 1
        };
        await axios.post(API_URL + '/admin_detail', param).then(res => {
            const response = res.data;
            if (response.err_code === '00') {
                let data = response.data;
                dt_user = {
                    id_operator: data.id_operator,
                    name: data.name,
                    password: null
                };
                let id_admin = data.id_operator;
                let name = data.name;
                let tgl = new Date();
                const _token = id_admin + 'Þ' + name + 'Þ' + tgl;
                const tokeen = CryptoJS.AES.encrypt(_token, secretKey).toString();
                localStorage.setItem(tokenLogin, tokeen);
            }
        });
        return dt_user;
    }

}
