import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData } from './pengaduanService';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import "moment/locale/id";

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


    render() {
        const { data } = this.props;
        const statusNikah = {};
        statusNikah[1] = "Belum menikah";
        statusNikah[2] = "Menikah";
        statusNikah[3] = "Cerai";
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
                        <b>Tanggal :</b> {moment(new Date(record.created_at)).format('DD-MM-YYYY HH:mm')}

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
                        <b>Jenis Kelamin :</b> {record.gender === 1 ? "Pria" : "Perempuan"}, {statusNikah[record.status_nikah]}
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
                sortable: true
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


                </div>
                <div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.pengaduan.data || [],
        isLoading: state.pengaduan.isLoading,
        error: state.pengaduan.error || null,
        totalData: state.pengaduan.totalData || 0,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchData(queryString));
        },

    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Pengaduan);