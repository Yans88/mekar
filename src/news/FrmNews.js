import React, { Component } from 'react'
import { Button, Col, Figure, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppButton from '../components/button/Button';
import noImg from '../assets/noPhoto.jpg';
import Loading from '../components/loading/MyLoading';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { addData, addDataSuccess, fetchDataDetail } from './newsService';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';

class FrmNews extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            id_news: '',
            title: '',
            description: '',
            short_description: '',
            img: '',
            imgUpload: '',
            id_operator: ''
        }
        this.state = {
            showSwalSuccess: false,
            errMsg: this.initialState,
            validated: false,
            isEdit: false,
            appsLoading: false,
            loadingForm: false,
            id_operator: '',
            id_news: '',
            title: '',
            description: '',
            short_description: '',
            img: '',
            imgUpload: noImg,

        };
    }

    componentDidMount() {
        const selectedId = sessionStorage.getItem('idNewsMekar');
        if (selectedId > 0) {       
            this.getData();            
        }
        this.setState({ id_operator: this.props.user.id_operator });
    }    

    getData = async () => {
        const selectedId = sessionStorage.getItem('idNewsMekar');
        const param = { id_news: selectedId }
        await this.props.onLoad(param);
        this.setState({ isEdit: true, imgUpload: this.props.data.img, id_news: selectedId });
        this.setState(this.props.data);       
    }

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        this.setState({
            ...this.state,
            loadingForm: false,
            errMsg: { ...this.state.errMsg, img: "", [name]: "" }
        })
        if (evt.target.name === "img") {
            value = evt.target.files[0];
            this.setState({ img: '', imgUpload: noImg })
            if (!value) return;
            if (!value.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ errMsg: { img: "Extension Invalid" } })
                this.setState({ loadingForm: true })
                return;
            }
            if (value.size > 2099200) {
                this.setState({ errMsg: { img: "File size over 2MB" } })
                this.setState({ loadingForm: true })
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(value);
            reader.onloadend = () => {
                this.setState({ img: value, imgUpload: reader.result })
            };
        }

        this.setState({
            [name]: value
        })
        //this.setState({ id_operator: this.props.user.id_operator });
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }

    handleChangeDesk(evt) {
        this.setState({
            ...this.state,
            description: evt,
            loadingForm: false,
            errMsg: { ...this.state.errMsg, description: "" }
        });
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            loadingForm: true,
        });
        errors.title = !this.state.title ? "Title required" : '';
        errors.short_description = !this.state.short_description ? "Short Description required" : '';
        errors.description = !this.state.description ? "Description required" : '';
        if (this.state.img) {
            var fileSize = this.state.img.size;
            if (fileSize > 2099200) { // satuan bytes 2099200 => 2MB
                errors.img = "File size over 2MB";
            }
        }
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
        this.setState({ errors, loadingForm: true });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.state);
        } else {
            console.error('Invalid Form')
        }

    }
    closeSwal() {
        this.props.closeSwal();
        this.props.history.push('/news');
    }

    render() {
        const { errMsg } = this.state;

        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">{this.state.isEdit ? ("Edit News") : "Add News"}</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {this.props.isLoading ? (<Loading />) :
                                        (
                                            <div className="card shadow-lg">
                                                <Form>
                                                    <div className="card-body my-card-body">
                                                        <Form.Row>
                                                            <Form.Group as={Col} xs={12} controlId="title">
                                                                <Form.Label>Title</Form.Label>
                                                                {errMsg.title ? (<span className="badge badge-danger text-error float-right">{errMsg.title}</span>) : ''}

                                                                <Form.Control
                                                                    value={this.state.title}
                                                                    autoComplete="off"
                                                                    onChange={this.handleChange.bind(this)}
                                                                    size="sm"
                                                                    name="title"
                                                                    type="text"
                                                                    required
                                                                    placeholder="Title" />

                                                            </Form.Group>

                                                        </Form.Row>
                                                        <Form.Row>
                                                            <Form.Group as={Col} xs={12} controlId="product_name">
                                                                <Form.Label>Short Description</Form.Label>
                                                                {errMsg.short_description ? (<span className="badge badge-danger text-error float-right">{errMsg.short_description}</span>) : ''}
                                                                <Form.Control
                                                                    value={this.state.short_description}
                                                                    autoComplete="off"
                                                                    onChange={this.handleChange.bind(this)}
                                                                    size="sm"
                                                                    name="short_description"
                                                                    type="text"
                                                                    required
                                                                    placeholder="Short Description" />

                                                            </Form.Group>

                                                        </Form.Row>
                                                        <Form.Row>
                                                            <Form.Group as={Col} xs={8} controlId="description">
                                                                <Form.Label>Description</Form.Label>
                                                                {errMsg.description ? (<span className="badge badge-danger text-error">{errMsg.description}</span>) : ''}
                                                                <SunEditor

                                                                    defaultValue={this.state.description}
                                                                    setContents={this.state.description}
                                                                    onChange={this.handleChangeDesk.bind(this)}
                                                                    setOptions={{
                                                                        placeholder: "Description ...",
                                                                        maxHeight: 200,
                                                                        height: 200,
                                                                        buttonList: [
                                                                            ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                        ]
                                                                    }}
                                                                />


                                                            </Form.Group>
                                                            <Form.Group as={Col} xs={2} controlId="img">
                                                                <Form.Label>Image</Form.Label>
                                                                {this.state.errMsg.img ? (<span className="float-right text-error badge badge-danger">{this.state.errMsg.img}</span>) : ''}
                                                                <Form.File
                                                                    setfieldvalue={this.state.img}
                                                                    onChange={this.handleChange.bind(this)}
                                                                    size="sm"
                                                                    name="img"
                                                                    style={{ "color": "rgba(0, 0, 0, 0)" }} />
                                                                <Form.Text className="text-muted">
                                                                    <em>- Images *.jpg, *.jpeg, *.png <br />- Maks. Size 2MB</em>
                                                                </Form.Text>

                                                            </Form.Group>

                                                            <Form.Group as={Col} xs={2} controlId="imagePreview">
                                                                <Form.Label style={{ "color": "rgba(0, 0, 0, 0)" }}>-----</Form.Label>
                                                                <Figure>
                                                                    <Figure.Image
                                                                        thumbnail
                                                                        width={130}
                                                                        height={100}
                                                                        alt=""
                                                                        src={this.state.imgUpload}
                                                                    />
                                                                </Figure>
                                                            </Form.Group>
                                                        </Form.Row>
                                                    </div>

                                                </Form>
                                                <div className="card-footer">
                                                    <Link to="/news">
                                                        <Button variant="danger">Cancel</Button>{' '}
                                                    </Link>
                                                    <AppButton
                                                        onClick={this.handleSubmit.bind(this)}
                                                        isLoading={this.props.isAddLoading ? this.props.isAddLoading : this.state.loadingForm}
                                                        type="button"
                                                        theme="success">
                                                        Simpan
                                                </AppButton>
                                                </div>
                                            </div>
                                        )}

                                </div>
                            </div>
                        </div>
                    </section>

                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type={this.props.tipeSWAL}
                        handleClose={this.closeSwal.bind(this)}
                    >
                    </AppSwalSuccess>) : ''}


                </div>
                <div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    
    return {
        data: state.news.dataEdit || {},
        isLoading: state.news.isLoading,
        isAddLoading: state.news.isAddLoading,
        error: state.news.error || null,
        contentMsg: state.news.contentMsg,
        showFormSuccess: state.news.showFormSuccess,
        showFormDelete: state.news.showFormDelete,
        tipeSWAL: state.news.tipeSWAL,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchDataDetail(queryString));
        },
        onAdd: (data) => {
            dispatch(addData(data));
        },

        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));
            //this.props.history.push('/news');
        }
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(FrmNews);
