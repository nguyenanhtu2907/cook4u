export const convertImageToBase64 = async (file, result) => {
    if(!file){
        return
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        result(reader.result);
    }
    reader.onerror = (error)=>{
        console.log('Error: ' + error);
    }
}