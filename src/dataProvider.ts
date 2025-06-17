import { DataProvider } from 'react-admin';

const STRAPI_API_URL = 'http://localhost:1337/api';

const authHeader = () => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const parseStrapiList = async (response: Response) => {
    const json = await response.json();
    const items = Array.isArray(json.data) ? json.data : [];

    return {
        data: items.map((item: any) => {
            const { id, documentId, thumbnail } = item;

            return {
                ...item,
                id: documentId || id,
                numberId: id,
                thumbnail: thumbnail?.formats?.thumbnail?.url
                    ? `http://localhost:1337${thumbnail.formats.thumbnail.url}`
                    : thumbnail?.url
                        ? `http://localhost:1337${thumbnail.url}`
                        : null,
            };
        }),
        total: json.meta?.pagination?.total || items.length,
    };
};


const parseStrapiOne = async (response: Response) => {
    const json = await response.json();
    if (!json.data || !json.data.documentId) {
        throw new Error('Response must contain data with a documentId.');
    }

    const item = json.data;

    const srcField = Array.isArray(item.src) && item.src.length > 0 ? item.src[0] : null;

    return {
        data: {
            ...item,
            id: item.documentId,
            numberId: item.id,
            src: srcField ? `http://localhost:1337${srcField.url}` : null, //  src là URL video
            srcId: srcField?.id, //  dùng cho Edit nếu cần
            thumbnail: item.thumbnail?.formats?.thumbnail?.url
                ? `http://localhost:1337${item.thumbnail.formats.thumbnail.url}`
                : item.thumbnail?.url
                    ? `http://localhost:1337${item.thumbnail.url}`
                    : null,
        },
    };
};



const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const page = params.pagination?.page || 1;
        const perPage = params.pagination?.perPage || 10;
        const field = params.sort?.field === 'numberId' ? 'id' : params.sort?.field || 'id';
        const order = params.sort?.order?.toLowerCase() || 'desc';

        const query = new URLSearchParams();
        query.set('pagination[page]', String(page));
        query.set('pagination[pageSize]', String(perPage));
        query.set('sort', `${field}:${order}`);

        const isVideo = resource === 'videos';
        const populateParam = isVideo ? '&populate=*' : '';

        const response = await fetch(
            `${STRAPI_API_URL}/${resource}?${query.toString()}${populateParam}`,
            { headers: authHeader() }
        );

        if (!response.ok) {
            throw new Error(`Error fetching list: ${response.statusText}`);
        }

        return parseStrapiList(response);
    },


    getOne: async (resource, params) => {
        const isVideo = resource === 'videos';
        const response = await fetch(
            `${STRAPI_API_URL}/${resource}/${params.id}${isVideo ? '?populate=*' : ''}`,
            { headers: authHeader() }
        );

        if (!response.ok) {
            throw new Error(`Error fetching one: ${response.statusText}`);
        }

        return parseStrapiOne(response);
    },

    create: async (resource, params) => {
        const data = { ...params.data };

        const formData = new FormData();
        const files: File[] = [];

        // Upload thumbnail
        if (data.thumbnail instanceof File) {
            formData.append('files', data.thumbnail);
            files.push(data.thumbnail);
            delete data.thumbnail;
        }

        // Upload src
        if (data.src instanceof File) {
            formData.append('files', data.src);
            files.push(data.src);
            delete data.src;
        }

        // Upload files trước
        let uploadedFiles: any[] = [];
        if (files.length > 0) {
            const uploadRes = await fetch(`${STRAPI_API_URL}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: authHeader().Authorization || '',
                },
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error(`Upload failed: ${uploadRes.statusText}`);
            }

            uploadedFiles = await uploadRes.json();
        }

        for (const f of uploadedFiles) {
            if (f.mime.startsWith('image/')) {
                data.thumbnail = f.id;
            } else if (f.mime.startsWith('video/')) {
                data.src = [f.id];
            }
        }


        const response = await fetch(`${STRAPI_API_URL}/${resource}`, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('Strapi error response:', err);
            throw new Error(`Error creating: ${response.statusText}`);
        }

        return parseStrapiOne(response);
    },



    update: async (resource, params) => {
        const documentId = params.id;

        // Nếu là videos thì xử lý riêng
        if (resource === 'videos') {
            const allowedFields = [
                "name", "description", "trimStart", "trimEnd", "thumbnail", "src"
            ];


            const safeData = allowedFields.reduce((acc, key) => {
                if (key in params.data) acc[key] = params.data[key];
                return acc;
            }, {} as Record<string, any>);

            // upload nếu cần
            const formData = new FormData();
            const files: File[] = [];

            if (params.data.thumbnail instanceof File) {
                formData.append('files', params.data.thumbnail);
                files.push(params.data.thumbnail);
            }
            if (params.data.src instanceof File) {
                formData.append('files', params.data.src);
                files.push(params.data.src);
            }

            if (files.length > 0) {
                const uploadRes = await fetch(`${STRAPI_API_URL}/upload`, {
                    method: 'POST',
                    headers: {
                        Authorization: authHeader().Authorization || '',
                    },
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error(`Upload failed: ${uploadRes.statusText}`);
                }

                const uploadedFiles = await uploadRes.json();
                for (const f of uploadedFiles) {
                    if (f.mime.startsWith('image/')) {
                        safeData.thumbnail = f.id;
                    } else if (f.mime.startsWith('video/')) {
                        safeData.src = [f.id];
                    }
                }
            }

            const response = await fetch(`${STRAPI_API_URL}/${resource}/${documentId}`, {
                method: 'PUT',
                headers: {
                    ...authHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: safeData }),
            });

            const json = await response.json();

            if (!response.ok || !json.data) {
                console.error('Update failed:', json?.error || json);
                throw new Error(
                    json?.error?.message || 'Update failed: Invalid response from server'
                );
            }

            return {
                data: {
                    ...json.data,
                    id: json.data.documentId || json.data.id,
                    numberId: json.data.id,
                },
            };
        }

        // Nếu không phải videos thì loại bỏ id và documentId khỏi data
        // Nếu không phải videos thì loại bỏ những field không hợp lệ
        const forbiddenFields = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'numberId', 'src', 'srcUrl', 'thumbnail'];

        const safeData = Object.fromEntries(
            Object.entries(params.data).filter(([key]) => !forbiddenFields.includes(key))
        );


        const response = await fetch(`${STRAPI_API_URL}/${resource}/${documentId}`, {
            method: 'PUT',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: safeData }),
        });

        const json = await response.json();

        if (!response.ok || !json.data) {
            console.error('Update failed:', json?.error || json);
            throw new Error(
                json?.error?.message || 'Update failed: Invalid response from server'
            );
        }

        return {
            data: {
                ...json.data,
                id: json.data.documentId || json.data.id,
            },
        };
    },




    delete: async (resource, params) => {
        const response = await fetch(
            `${STRAPI_API_URL}/${resource}/${params.id}`,
            {
                method: 'DELETE',
                headers: authHeader(),
            }
        );

        if (response.status === 204) {
            return { data: { id: params.id } };
        }

        if (!response.ok) {
            throw new Error(`Error deleting: ${response.statusText}`);
        }

        const json = await response.json();

        return {
            data: {
                ...json.data,
                id: json.data.documentId,
                numberId: json.data.id,
            },
        };
    },

    getMany: async (resource, params) => {
        const query = new URLSearchParams();
        query.set('filters[documentId][$in]', params.ids.join(','));

        const response = await fetch(
            `${STRAPI_API_URL}/${resource}?${query.toString()}`,
            { headers: authHeader() }
        );

        if (!response.ok) {
            throw new Error(`Error in getMany: ${response.statusText}`);
        }

        return parseStrapiList(response);
    },

    getManyReference: async () => ({ data: [], total: 0 }),
    updateMany: async () => ({ data: [] }),
    deleteMany: async () => ({ data: [] }),
};

export default dataProvider;
