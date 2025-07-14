
const apiUrl = 'http://localhost:8093/api/admin';

const dataProvider = {
  getList: async (resource) => {

    const url = `${apiUrl}/${resource}`;

    const response = await fetch(url);
    const result = await response.json();

    return {
      data: result.allUsers,
      total: result.userCount,
    }
  },

  getOne: async (resource, { id }) => {
    const response = await fetch(`${apiUrl}/${resource}/${id}`);
    const result = await response.json();
    return { data: result };
  },

  create: async (resource, { data }) => {
    const response = await fetch(`${apiUrl}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { data: result };
  },

  update: async (resource, { id, data }) => {
    const response = await fetch(`${apiUrl}/${resource}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { data: result };
  },

  delete: async (resource, { id }) => {
    await fetch(`${apiUrl}/${resource}/${id}`, { method: "DELETE" });
    return { data: { id } };
  },
};

export default dataProvider;