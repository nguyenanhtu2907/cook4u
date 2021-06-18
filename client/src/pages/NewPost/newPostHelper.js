import * as Yup from 'yup';

export const createPostSchema = Yup.object({
    title: Yup.string().required('Tiêu đề món ăn không thể để trống được!!!'),
    ingredients: Yup.array().required('Nguyên liệu không thể thiếu được.'),
    steps: Yup.array().required('Bạn vui lòng nhập các bước tạo thành món ăn.'),
});

export const initPost = {
    thumbnail: '',
    title: '',
    description: '',
    ration: '',
    time: '',
    ingredients: [
        {
            id: new Date().getTime().toString(),
            text: '',
        },
    ],
    steps: [
        {
            id: new Date().getTime().toString(),
            text: '',
            images: [],
        },
    ],
};
