import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData, showConfirmOnprogress, confirmSuccess, updStatus, showConfirmCompleted } from './pengaduanService';
import ReactDatatable from '@ashvin27/react-datatable';
import { Badge, Figure } from 'react-bootstrap';
import moment from 'moment';
import "moment/locale/id";
import { BsArrowRepeat } from "react-icons/bs";
import { BiAbacus } from "react-icons/bi"
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import noImg from '../assets/noPhoto.jpg';

class Pengaduan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort_order: "DESC",
            sort_column: "id",
            type: 1,
            keyword: '',
            page_number: 1,
            per_page: 10,
            cms: 1,
            loadingForm: false,
            showBK: false,
            bk: null
        }
    }

    componentDidMount() {
        this.props.onLoad(this.state);
    }

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

    confirmProgress = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator, status: 1 }
        });
        this.props.showConfirmProgress(true);
    }

    showModalBk = (record) => {
        const bk = <Figure>
            <Figure.Image
                className="img-bk"
                alt=""
                src={record.photo_bukti_kekerasan ? record.photo_bukti_kekerasan : noImg}
            />
        </Figure>;
        this.setState({
            showBK: true,
            bk: bk,
            selected: { ...record, id_operator: this.props.user.id_operator }
        });

    }

    confirmComplete = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator, status: 2 }
        });
        this.props.showConfirmComplete(true);
    }

    handleClose = () => {
        this.setState({
            showBK: false,
            selected: { id_operator: this.props.user.id_operator },
        });
        this.props.showConfirmComplete(false);
        this.props.showConfirmProgress(false);
    };

    handleProses() {
        this.props.onProgress(this.state.selected)
    }


    render() {
        const { data } = this.props;
        const statusNikah = {};
        statusNikah[1] = "Belum menikah";
        statusNikah[2] = "Menikah";
        statusNikah[3] = "Cerai Hidup";
        statusNikah[4] = "Cerai Mati";
        const bersediaDihubungi = {};
        bersediaDihubungi[0] = "-";
        bersediaDihubungi[1] = "Ya";
        bersediaDihubungi[2] = "Tidak";

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
                key: "nama_pelapor",
                text: "Pelapor",
                width: 190,
                align: "center",
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        {record.nama_pelapor} <br />
                        <b>Tanggal :</b> {moment(new Date(record.created_at)).format('DD-MM-YYYY HH:mm')}<br />
                        {record.status === 0 ? (<Badge variant="danger">New</Badge>) : ''}
                        {record.status === 1 ? (<Badge variant="warning">On Progress</Badge>) : ''}
                        {record.status === 2 ? (<Badge variant="success">Completed</Badge>) : ''}

                    </Fragment>)
                }
            },
            {
                key: "nama_lengkap",
                text: "Info Laporan",
                align: "center",
                cell: record => {
                    return (<Fragment>
                        <b>Nama Lengkap :</b> {record.nama_lengkap} <br />
                        <b>Tanggal Lahir :</b> {moment(new Date(record.dob)).format('DD-MM-YYYY')}<br />
                        <b>Jenis Kelamin :</b> {record.gender === 1 ? "Pria" : "Perempuan"}, {statusNikah[record.status_nikah]}<br/>
                        <b>Sudah mendapatkan bantuan :</b> {bersediaDihubungi[record.sdh_ada_penanganan]}
                    </Fragment>)
                }
            },
            {
                key: "no_hp",
                text: "Contact",
                align: "center",
                sortable: false,
                cell: record => {
                    return (<Fragment>
                        <b>Phone :</b> {record.no_hp} <br />
                        <b>Gereja Lokal :</b> {record.gereja_lokal ? record.gereja_lokal : '-'}<br />
                        <b>Bersedia dihubungi :</b>{bersediaDihubungi[record.bersedia_dihubungi]}
                    </Fragment>)
                }
            },
            {
                key: "jenis_kasus",
                text: "Jenis Kasus",
                align: "center",
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        {record.jenis_kasus} <br />
                        {record.status === 0 ? (
                            <Fragment>
                                <button className="btn btn-info"
                                    onClick={e => this.showModalBk(record)}
                                    style={{ marginRight: 3 }}
                                >
                                    <BiAbacus /> Bukti Kekerasan
                            </button>
                                <button className="btn btn-warning"
                                    onClick={e => this.confirmProgress(record)}
                                >
                                    <BsArrowRepeat /> Set onprogress
                            </button>
                            </Fragment>

                        ) : ''}
                        {record.status === 1 ? (
                            <Fragment>
                                <button className="btn btn-info"
                                    onClick={e => this.showModalBk(record)}
                                    style={{ marginRight: 3 }}
                                >
                                    <BiAbacus /> Bukti Kekerasan</button>
                                <button className="btn btn-success"
                                    onClick={e => this.confirmComplete(record)}
                                >
                                    <i className="fa fa-check"></i> Set Completed</button>
                            </Fragment>

                        ) : ''}

                        {record.status === 2 ? (
                            <Fragment>
                                <button className="btn btn-info btn-block"
                                    onClick={e => this.showModalBk(record)}
                                    style={{ marginRight: 3 }}
                                >
                                    <BiAbacus /> Bukti Kekerasan</button>

                            </Fragment>

                        ) : ''}

                    </Fragment>)
                }
            },

        ];
        const config = {
            key_column: 'id',
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
        const contentProgress = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>memproses data ini ?</div>' }} />;

        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Pengaduan</h1>
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
                        show={this.props.showConfirmOnprogress}
                        size="sm"
                        form={contentProgress}
                        handleClose={this.handleClose.bind(this)}
                        backdrop="static"
                        keyboard={false}
                        title="Confirm"
                        titleButton="Set Onprogress"
                        themeButton="warning"
                        isLoading={this.props.isAddLoading}
                        formSubmit={this.handleProses.bind(this)}
                    ></AppModal>
                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type={this.props.tipeSWAL}
                        handleClose={this.props.closeSwal}
                    ></AppSwalSuccess>) : ''}
                    <AppModal
                        show={this.props.showConfirmCompletee}
                        size="sm"
                        form={contentProgress}
                        handleClose={this.handleClose.bind(this)}
                        backdrop="static"
                        keyboard={false}
                        title="Confirm"
                        titleButton="Set Complete"
                        themeButton="success"
                        isLoading={this.props.isAddLoading}
                        formSubmit={this.handleProses.bind(this)}
                    ></AppModal>
                    <AppModal
                        show={this.state.showBK}

                        form={this.state.bk}
                        handleClose={this.handleClose.bind(this)}
                        backdrop="static"
                        keyboard={false}
                        title="Photo Bukti Kekerasan"
                        noBtnAction={true}
                        isLoading={this.props.isAddLoading}
                        formSubmit={this.handleProses.bind(this)}
                    ></AppModal>
                </div>


            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.pengaduan.data || [],
        isLoading: state.pengaduan.isLoading,
        isAddLoading: state.pengaduan.isAddLoading,
        showConfirmOnprogress: state.pengaduan.showConfirmOnprogress,
        showConfirmCompletee: state.pengaduan.showConfirmComplete,
        error: state.pengaduan.error || null,
        totalData: state.pengaduan.totalData || 0,
        contentMsg: state.pengaduan.contentMsg,
        showFormSuccess: state.pengaduan.showFormSuccess,
        tipeSWAL: state.pengaduan.tipeSWAL,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchData(queryString));
        },
        showConfirmProgress: (data) => {
            dispatch(showConfirmOnprogress(data));
        },
        showConfirmComplete: (data) => {
            dispatch(showConfirmCompleted(data));
        },
        onProgress: (data) => {
            dispatch(updStatus(data));
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(confirmSuccess(_data));
            const queryString = {
                sort_order: "DESC",
                sort_column: "id",
                keyword: '',
                page_number: 1,
                per_page: 10,
                cms: 1
            }
            dispatch(fetchData(queryString));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Pengaduan);