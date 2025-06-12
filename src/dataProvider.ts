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

    const srcUrl = Array.isArray(item.src) && item.src.length > 0 && item.src[0].url
    ? `http://localhost:1337${item.src[0].url}`
    : null

    return {
        data: {
            ...item,
            id: item.documentId,
            numberId: item.id,
            src: srcUrl,
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

        const response = await fetch(
            `${STRAPI_API_URL}/${resource}`,
            {
                method: 'POST',
                body: JSON.stringify({ data: params.data }),
                headers: authHeader(),
            }
        );

        if (!response.ok) {
            throw new Error(`Error creating: ${response.statusText}`);
        }

        return parseStrapiOne(response);

    },

    update: async (resource, params) => {
        const { id: documentId } = params.data;

        // Danh sách các field cho phép cập nhật
        const allowedFields = [
            "name",
            "company",
            "avatar",
            "city",
            "country",
            "zipCode",
            // thêm nếu có custom field khác cần cập nhật
        ];

        // Tạo object safeData chỉ chứa field hợp lệ
        const safeData = allowedFields.reduce((acc, key) => {
            if (key in params.data) {
                acc[key] = params.data[key];
            }
            return acc;
        }, {} as Record<string, any>);

        const response = await fetch(`${STRAPI_API_URL}/${resource}/${documentId}`, {
            method: 'PUT',
            headers: authHeader(),
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
                id: json.data.id, // không dùng json.data.documentId nữa, Strapi trả về đúng là .id
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
