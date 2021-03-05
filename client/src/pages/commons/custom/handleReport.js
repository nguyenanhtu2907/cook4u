import * as api from '../../../api/index';
export const handleReport = async (type, target, userReport) => {
    const report = {
        uuid: new Date().getTime().toString(),
        type: type,
        target: target,
        userReport: userReport,
    };
    const {data}= await api.reportApi(report);
    return data;
}