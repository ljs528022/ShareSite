import { fetchUtils } from 'react-admin';

const dataProvider = {
  getList: (resource, params) => {
    return Promise.resolve({
      data: [
        { id: 1, name: '홍길동', email: 'hong@example.com' },
        { id: 2, name: '이몽룡', email: 'lee@example.com' },
      ],
      total: 2,
    });
  },
  // ...다른 메서드는 나중에 구현
};

export default dataProvider;