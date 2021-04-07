import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData } from './membersService';
import { Figure } from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import noImg from '../assets/noPhoto.jpg';

class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sort_order: "ASC",
            sort_column: "nama",
            type: 1,
            keyword: '',
            page_number: 1,
            per_page: 10,
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
                width: 200,
                align: "center",
                sortable: true
            },
            {
                key: "email",
                text: "Contact",
                align: "center",

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

        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Members</h1>
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
        data: state.members.data || [],
        isLoading: state.members.isLoading,
        error: state.members.error || null,
        totalData: state.members.totalData || 0,
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

export default connect(mapStateToProps, mapDispatchToPros)(Members);