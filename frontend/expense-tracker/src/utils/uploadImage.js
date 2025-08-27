import { API_ENDPOINTS } from "./apiPaths"
import axiosInstance from "./axiosInstance"

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    // Append image file to form data
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(API_ENDPOINTS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }, // Set enabled header for file upload
        });
        return response.data
    } catch (error) {
        console.error("Error uploading the image", error);
        throw error; // Rethrowing error to ease handling
    }
};

export default uploadImage;