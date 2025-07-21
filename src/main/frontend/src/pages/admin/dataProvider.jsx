import { deleteData, getData, postData } from "../../services/api";

const dataProvider = {
  getList: async (resource,  { pagination, sort }) => {
    const { page, perPage } = pagination;
    const { field, order } = sort;

    const res = await getData(`/api/admin/${resource}`);
    const { data, count } = res.data;

    if(resource === "users") {
      const users = data.map(u => ({
          ...u,
        id: u.username,
        userNum: u.userKey,
        name: u.useralias,
        email: u.email,
        regType: u.regtype,
        state: u.state,
        visitcnt: u.visitcnt,
        tradecnt: u.tradecnt,
        regDate: u.regDate,
        editedDate: u.editedDate,
        auth: u.auth,
      }));

      const sorted = [...users].sort((a, b) => {
        if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
        if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
        return 0;
      });
      
      const start = (page - 1) * perPage;
      const end  = start + perPage;
      const paginated = sorted.slice(start, end);
      
      return {
        data: paginated,
        total: count,
      }
    } else if(resource === "items") {
      const items = data.map(i => ({
        ...i,
        id: i.itemKey,
        userKey: i.userKey,
        subject: i.subject,
        cateKey: i.cateKey,
        price: i.price,
        itemtype: i.itemtype,
        purtype: i.purtype,
        tradestatus: i.tradestatus,
        writeDate: i.writeDate,
        viewcnt: i.viewcnt,
      }));

      const sorted = [...items].sort((a, b) => {
        if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
        if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
        return 0;
      });
      
      const start = (page - 1) * perPage;
      const end  = start + perPage;
      const paginated = sorted.slice(start, end);

      return {
        data: paginated,
        total: count,
      }
    }
  },

  getOne: async (resource, { id }) => {
    const response = await getData(`/api/admin/${resource}/${id}`)
    const result = response.data;
    return { data: result };
  },

  create: async (resource, { data }) => {
    const response = await postData(`/api/admin/${resource}`, data);
    const result = response.data;
    return { data: result };
  },

  update: async (resource, { id, data }) => {
    const response = await postData(`/api/admin/${resource}/${id}`, data);
    const result = await response.json();
    return { data: result };
  },

  delete: async (resource, { id }) => {
    await deleteData(`/api/admin/${resource}/${id}`);
    return { data: { id } };
  },
};

export default dataProvider;