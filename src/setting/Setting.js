import React, { Component } from 'react'
import { Alert, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import AppButton from '../components/button/Button';
import Loading from '../components/loading/MyLoading';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import { fetchData, addData, chgProps, addDataSuccess } from './settingService';

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errMsg: { email: '' },
        };
    }

    componentDidMount() {
        this.props.onLoad();
    }

    handleChange(evt) {
        this.setState({ errMsg: { email: '' } });
        const name = evt.target.name;
        var value = evt.target.value;
        const dt = {};
        dt['key'] = name;
        dt['value'] = value;
        this.props.changeProps(dt);
    }

    handleChangeDesk(name, value) {
        const dt = {};
        dt['key'] = name;
        dt['value'] = value;
        this.props.changeProps(dt);
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        //console.log(this.props.data.send_mail);
        if (this.props.data.send_mail) {
            if (!pattern.test(this.props.data.send_mail)) {
                errors.email = "Please enter valid email address";
            }
        }

        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.props.data);
        } else {
            console.error('Invalid Form')
        }

    }

    validateForm(errors) {

        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    closeSwal() {
        this.props.closeSwal();
    }

    render() {
        const { data } = this.props;
        const { errMsg } = this.state;
        return (

            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Setting</h1>
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
                                                            <Form.Group as={Col} xs={6} controlId="send_mail">
                                                                {errMsg.email ?
                                                                    (<span className="float-right text-error badge badge-danger">{errMsg.email}
                                                                    </span>) : ''}
                                                                <Form.Label>Email</Form.Label>
                                                                <Form.Control
                                                                    value={data.send_mail}
                                                                    autoComplete="off"
                                                                    onChange={this.handleChange.bind(this)}
                                                                    size="sm"
                                                                    name="send_mail"
                                                                    type="text"
                                                                    placeholder="Email" />

                                                            </Form.Group>

                                                            <Form.Group as={Col} xs={6} controlId="mail_pass">
                                                                <Form.Label>Password</Form.Label>
                                                                <Form.Control
                                                                    value={data.mail_pass}
                                                                    autoComplete="off"
                                                                    onChange={this.handleChange.bind(this)}
                                                                    size="sm"
                                                                    name="mail_pass"
                                                                    type="text"
                                                                    placeholder="Password" />
                                                            </Form.Group>
                                                        </Form.Row>

                                                        <Form.Row>
                                                            <Form.Group as={Col} xs={12} controlId="content_reg">
                                                                <Form.Label>Content Email Info Akun Satgas</Form.Label>
                                                                <SunEditor
                                                                    defaultValue={data.content_reg}
                                                                    setContents={data.content_reg}
                                                                    onChange={this.handleChangeDesk.bind(this, 'content_reg')}
                                                                    setOptions={{
                                                                        placeholder: "Content Email Info Akun Satgas ...",
                                                                        maxHeight: 250,
                                                                        height: 250,
                                                                        buttonList: [
                                                                            ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                        ]
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Form.Row>

                                                        <br />
                                                        <Form.Row>
                                                            <Form.Group as={Col} xs={12} controlId="content_forgotPass">
                                                                <Form.Label>Content Email Forgot Password</Form.Label>
                                                                <SunEditor
                                                                    defaultValue={data.content_forgotPass}
                                                                    setContents={data.content_forgotPass}
                                                                    onChange={this.handleChangeDesk.bind(this, 'content_forgotPass')}
                                                                    setOptions={{
                                                                        placeholder: "Content Email Forgot Password ...",
                                                                        maxHeight: 250,
                                                                        height: 250,
                                                                        buttonList: [
                                                                            ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                        ]
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Form.Row>

                                                        <br />
                                                        <Form.Row>
                                                            <Form.Group as={Col} xs={12} controlId="contact_us">
                                                                <Form.Label>Kontak</Form.Label>
                                                                <SunEditor
                                                                    defaultValue={data.contact_us}
                                                                    setContents={data.contact_us}
                                                                    onChange={this.handleChangeDesk.bind(this)}
                                                                    setOptions={{
                                                                        placeholder: "Kontak ...",
                                                                        maxHeight: 250,
                                                                        height: 250,
                                                                        buttonList: [
                                                                            ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                        ]
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Form.Row>
                                                    </div>

                                                </Form>
                                                <div className="card-footer">
                                                    {errMsg.email ?
                                                        (<Alert variant="danger" show={true}>Error : {errMsg.email}</Alert>) : ''}
                                                    <AppButton
                                                        onClick={this.handleSubmit.bind(this)}
                                                        isLoading={this.props.isAddLoading}
                                                        type="button"
                                                        theme="success">
                                                        Update Data
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
        data: state.setting.data || {},
        isLoading: state.setting.isLoading,
        isAddLoading: state.setting.isAddLoading,
        error: state.setting.error || null,
        contentMsg: state.setting.contentMsg,
        showFormSuccess: state.setting.showFormSuccess,
        tipeSWAL: state.setting.tipeSWAL,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchData());
        },
        changeProps: (data) => {
            dispatch(chgProps(data));
        },
        onAdd: (data) => {
            dispatch(addData(data))
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['isAddLoading'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));
            dispatch(fetchData());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Setting);