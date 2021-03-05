import { Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as api from '../../api/index';
import { useWindowHeightAndWidth } from '../commons/custom/useWindowHeightAndWidth';
import './styles.sass';
function Admin(props) {
    const [reports, setReports] = useState([]);
    const [height, width] = useWindowHeightAndWidth();
    useEffect(async () => {
        const { data } = await api.getReportsApi();
        setReports(data);
    }, [])

    const removeReport = async (uuid) => {
        const { data } = await api.removeReportApi(uuid);
        setReports([...reports.filter(report => report.uuid !== data.uuid)]);
    }
    return (
        <div className="admin-page">
            <div className="admin-page--paper pd-left-3 pd-right-3 shadow">
                <Table className="admin-page--paper--table ">
                    <TableHead>
                        <TableRow>
                            <TableCell>Người báo cáo</TableCell>
                            <TableCell align="center">Đối tượng</TableCell>
                            {width > 767 && (
                                <TableCell align="center">Thời gian</TableCell>
                            )}
                            <TableCell align="center">Đường dẫn</TableCell>
                            <TableCell align="center">Xóa</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report) => {
                            report.createdAt = new Date(report.createdAt)
                            return (
                                <TableRow key={report.uuid}>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/user/${report.userReport.uuid}`} className="big-card--content__author ">
                                            <div className="big-card--content__author__image">
                                                <img referrerPolicy='no-referrer' width='50' height='50' src={report.userReport.imageUrl} alt="" />
                                            </div>
                                            <div className="big-card--content__author__name">
                                                {report.userReport.name}
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">{report.type === "post" ? "Bài viết" : "Bình luận"}</TableCell>
                                    {width > 767 && (
                                        <TableCell align="center">{`${report.createdAt.getDay()}/${report.createdAt.getMonth() + 1}/${report.createdAt.getFullYear()}`}</TableCell>
                                    )}
                                    <TableCell align="center"><Button><Link to={`/post/${report.target}`}>Link</Link></Button></TableCell>
                                    <TableCell align="center"><IconButton onClick={() => removeReport(report.uuid)} ><DeleteForeverIcon /></IconButton></TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default Admin;