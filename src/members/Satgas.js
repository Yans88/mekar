import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData, addData, addForm, addDataSuccess, showConfirmDel, deleteData, clearAddDataError } from './membersService';
import { Button, Form, Figure, Col, Alert } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import ReactDatatable from '@ashvin27/react-datatable';
import noImg from '../assets/noPhoto.jpg';

class Members extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_member: '',
            nia: '',
            nama: '',
            pass: '',
            photo: '',
            phone: '',
            email: '',
            gereja_lokal: '',
            gembala: '',
            asal_bpd: '',
            id_operator: '',
            imgUpload: '',
            type: 2
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "nama",
            type: 2,
            keyword: '',
            page_number: 1,
            per_page: 10,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
        }
    }

    componentDidMount() {
        this.props.onLoad(this.state);
    }

    editRecord = (record) => {
        this.setState({
            errMsg: this.initSelected,
            selected: { ...record, imgUpload: record.img }
        });
        this.props.showForm(true);
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    handleClose = () => {
        this.setState({
            errMsg: {},
            selected: this.initSelected,
            loadingForm: false
        });
        this.props.showForm(false);
        this.props.showConfirmDel(false);
    };

    tableChangeHandler = (data) => {
        let queryString = this.state;
        Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                queryString.sort_order = data[key].order;
                queryString.sort_column = data[key].column;
            }
            if (key === "page_number") {
                queryString.page_number = data[key];
            }
            if (key === "page_size") {
                queryString.per_page = data[key];
            }
            if (key === "filter_value") {
                queryString.keyword = data[key];
            }
            return true;
        });
        this.props.onLoad(this.state);
    }

    handleChangeNumberOnly = evt => {
        this.props.clearErrProps();
        const name = evt.target.name;
        const number = (evt.target.validity.valid) ? evt.target.value : this.state.selected[name];
        if (evt.target.validity.valid) {
            this.setState({ loadingForm: false, errMsg: { ...this.state.errMsg, [name]: "" } });
        }
        this.setState({ selected: { ...this.state.selected, [name]: number } });
    }

    handleChange(event) {
        const { name, value } = event.target
        var val = value;
        this.props.clearErrProps();
        this.setState({
            loadingForm: false,
            errMsg: { ...this.state.errMsg, [name]: "" },
            selected: {
                ...this.state.selected,
                [name]: val
            }
        });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    discardChanges = () => {
        this.setState({ errMsg: {}, selected: this.initSelected, loadingForm: false });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.props.showForm(true);
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            loadingForm: true,
        });
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        errors.nia = !this.state.selected.nia ? "NIA required" : '';
        errors.nama = !this.state.selected.nama ? "Nama required" : '';
        errors.pass = !this.state.selected.pass ? "Password required" : '';
        errors.phone = !this.state.selected.phone ? "Phone required" : '';
        errors.email = !this.state.selected.email ? "Email required" : '';
        if (errors.email === '' && !pattern.test(this.state.selected.email)) {
            errors.email = "Please enter valid email address";
        }
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.state.selected);
        } else {
            console.error('Invalid Form')
        }
        // this.setState({
        //     ...this.state,
        //     loadingForm: false,
        // });
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleDelete() {
        this.props.onDelete(this.state.selected)
    }

    render() {
        const { data } = this.props;
        const { selected, errMsg } = this.state;
        const columns = [
            {
                key: "no",
                text: "No.",
                width: 20,
                align: "center",
                sortable: false,
                cell: (row, index) => <div style={{ textAlign: "center" }}>{((this.state.page_number - 1) * this.state.per_page) + index + 1 + '.'}</div>,
                row: 0
            },
            {
                key: "nama",
                text: "Nama",
                align: "center",
                sortable: true
            },
            {
                key: "email",
                text: "Contact",
                align: "center",
                width: 180,
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        {record.email} <br />
                        <b>Phone :</b> {record.phone}
                    </Fragment>)
                }
            },
            {
                key: "asal_bpd",
                text: "Info",
                align: "center",
                sortable: false,
                width: 250,
                cell: record => {
                    return (<Fragment>
                        <b>- Asal BPD :</b> {record.asal_bpd} <br />
                        <b>- Gereja Lokal :</b> {record.gereja_lokal}<br />
                        <b>- Gembala :</b> {record.gembala}
                    </Fragment>)
                }
            },
            {
                key: "photo",
                text: "Photo",
                align: "center",
                sortable: false,
                width: 180,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Figure style={{ marginTop: ".3rem", marginBottom: 0 }}>
                                <Figure.Image
                                    thumbnail
                                    width={150}
                                    height={120}
                                    src={record.photo ? record.photo : noImg}
                                />

                            </Figure></div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                width: 70,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-danger btn-xs"
                                    onClick={() => this.deleteRecord(record)}>
                                    <i className="fa fa-trash"></i> Delete
                            </button>
                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_member',
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            },
            language: {
                loading_text: "Please be patient while data loads..."
            }
        }
        const frmUser = <Form id="myForm">
            {this.props.errorPriority ? (<Alert variant="danger" show={true}>Error : {this.props.errorPriority}</Alert>) : ''}
            <Form.Row>
                <Form.Group as={Col} xs={6} controlId="nia">
                    <Form.Label>Nomor Induk Anggota</Form.Label>
                    {this.props.nia ? (<span className="float-right text-error badge badge-danger">{this.props.nia}
                    </span>) : ''}
                    {errMsg.nia ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.nia}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="nia"
                        type="text" pattern="[0-9]*"
                        onInput={this.handleChangeNumberOnly.bind(this)}
                        value={selected.nia}
                        onChange={this.handleChangeNumberOnly.bind(this)}
                        placeholder="Nomor Induk Anggota" />
                </Form.Group>
                <Form.Group as={Col} xs={6} controlId="nama">
                    <Form.Label>Nama Lengkap</Form.Label>
                    {errMsg.nama ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.nama}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="nama"
                        type="text"
                        value={selected.nama}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Nama Lengkap" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} xs={6} controlId="pass">
                    <Form.Label>Password</Form.Label>
                    {errMsg.pass ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.pass}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="pass"
                        type="text"
                        value={selected.pass}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Password" />
                </Form.Group>
                <Form.Group as={Col} xs={6} controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    {errMsg.phone ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.phone}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="phone"
                        type="text" pattern="[0-9]*"
                        onInput={this.handleChangeNumberOnly.bind(this)}
                        value={selected.phone}
                        onChange={this.handleChangeNumberOnly.bind(this)}
                        placeholder="Phone" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} xs={6} controlId="email">
                    <Form.Label>Email</Form.Label>
                    {errMsg.email ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.email}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="email"
                        type="text"
                        value={selected.email}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Email" />
                </Form.Group>
                <Form.Group as={Col} xs={6} controlId="gereja_lokal">
                    <Form.Label>Gereja Lokal</Form.Label>
                    {errMsg.gereja_lokal ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.gereja_lokal}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="gereja_lokal"
                        type="text"
                        value={selected.gereja_lokal}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Gereja Lokal" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} xs={6} controlId="asal_bpd">
                    <Form.Label>Asal BPD</Form.Label>
                    {errMsg.asal_bpd ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.asal_bpd}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="asal_bpd"
                        type="text"
                        value={selected.asal_bpd}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Asal BPD" />
                </Form.Group>
                <Form.Group as={Col} xs={6} controlId="gembala">
                    <Form.Label>Gembala</Form.Label>
                    {errMsg.gembala ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.gembala}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="gembala"
                        type="text"
                        value={selected.gembala}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Gembala" />
                </Form.Group>
            </Form.Row>
        </Form>;

        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        return (
            <div>

                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Satgas</h1>
                                </div>{/* /.col */}

                            </div>{/* /.row */}
                        </div>{/* /.container-fluid */}
                    </div>
                    {/* /.content-header */}
                    {/* Main content */}
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {/* card start */}
                                    <div className="card card-success shadow-lg" style={{ "minHeight": "470px" }}>
                                        <div className="card-header">
                                            <Button variant="success" onClick={this.discardChanges}><i className="fa fa-plus"></i> Add</Button>

                                        </div>

                                        <div className="card-body">
                                            {data ? (
                                                <ReactDatatable
                                                    config={config}
                                                    records={data}
                                                    columns={columns}
                                                    dynamic={true}
                                                    onChange={this.tableChangeHandler}
                                                    loading={this.props.isLoading}
                                                    total_record={this.props.totalData}
                                                />
                                            ) : (<p>No Data ...</p>)}

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <AppModal
                        show={this.props.showFormAdd}
                        form={frmUser}
                        backdrop="static"
                        keyboard={false}
                        title="Add Satgas"
                        titleButton="Save change"
                        themeButton="success"
                        handleClose={this.handleClose}
                        isLoading={this.props.isAddLoading ? this.props.isAddLoading : this.state.loadingForm}
                        formSubmit={this.handleSubmit.bind(this)}
                    ></AppModal>
                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type={this.props.tipeSWAL}
                        handleClose={this.props.closeSwal}
                    >
                    </AppSwalSuccess>) : ''}
                    <AppModal
                        show={this.props.showFormDelete}
                        size="sm"
                        form={contentDelete}
                        handleClose={this.handleClose.bind(this)}
                        backdrop="static"
                        keyboard={false}
                        title="Delete Satgas"
                        titleButton="Delete Satgas"
                        themeButton="danger"
                        isLoading={this.props.isAddLoading}
                        formSubmit={this.handleDelete.bind(this)}
                    ></AppModal>

                </div>
                <div>

                </div>

            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.members.data || [],
        isLoading: state.members.isLoading,
        isAddLoading: state.members.isAddLoading,
        error: state.members.error || null,
        errorPriority: state.members.errorPriority || null,
        totalData: state.members.totalData || 0,
        showFormAdd: state.members.showFormAdd,
        contentMsg: state.members.contentMsg,
        showFormSuccess: state.members.showFormSuccess,
        showFormDelete: state.members.showFormDelete,
        tipeSWAL: state.members.tipeSWAL,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchData(queryString));
        },
        onAdd: (data) => {
            dispatch(addData(data));
        },
        onDelete: (data) => {
            dispatch(deleteData(data));
        },
        showForm: (data) => {
            dispatch(addForm(data));
        },
        showConfirmDel: (data) => {
            dispatch(showConfirmDel(data));
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));
            const queryString = {
                sort_order: "ASC",
                sort_column: "nama",
                per_page: 10,
                type: 2
            }
            dispatch(fetchData(queryString));
        },
        clearErrProps: () => {
            dispatch(clearAddDataError());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Members);