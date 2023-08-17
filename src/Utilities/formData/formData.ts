/*
	* Limitations
	* Accepts both `application/x-www-form-urlencoded` and `multipart/form-data` content
	* Only supports string form values, no file uploads
	* */
type FormInput = string | File;

export function parseFormData(formData: FormData) {
	const data: Record<string, FormInput|FormInput[]> = {};
	for (const [key] of formData) {
		if (!data[key]) {
			const val = formData.getAll(key);
			data[key] = val.length === 1 ? val[0] : val;
		}
	}
	return data;
}
