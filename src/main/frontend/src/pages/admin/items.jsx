import { Card, CardContent, CardHeader, CardMedia, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { ListContextProvider, useListContext, useListController } from "react-admin";

const Items = () => {
    const controlProps = useListController({ 
        resource: "items",
        sort: { field: "id", order: "DESC" },
        pagination: { page: 1, perPage: 6 },
    });

    return (
    <ListContextProvider value={controlProps}>
        <GetItemList />
    </ListContextProvider>
    );
};

const GetItemList = () => {
    const { data, sort, setSort, setPage, perPage, setPerPage, total } = useListContext(); 

    const handleSortChange = (e) => {
        const [field, order] = e.target.value.split(",");
        setSort({ field, order });
    };

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value, 10));
        setPage(1);
    };

    return (
    <>
    <Typography variant="h5">{`총 상품 : ${total} 개`}</Typography>

    {/* 정렬 선택 */}
    <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
        <Grid>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 70 }}>
                <InputLabel id="sort-label">정렬</InputLabel>
                <Select
                    labelId="sort-label"
                    value={`${sort.field}, ${sort.order}`}
                    onChange={handleSortChange}
                    label="정렬"
                >
                    <MenuItem value="id,DESC">최신순</MenuItem>
                    <MenuItem value="id,ASC">오래된순</MenuItem>
                    <MenuItem value="price,DESC">높은가격순</MenuItem>
                    <MenuItem value="price,ASC">낮은가격순</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 70 }}>
                <InputLabel id="per-page-label">상품 수</InputLabel>
                <Select
                    labelId="per-page-label"
                    value={perPage}
                    onChange={handlePerPageChange}
                    label="페이지 당 상품 수"
                >   
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                </Select>
            </FormControl>
        </Grid>
    </Grid>

    {/* 상품 카드 리스트트 */}
    <Grid container spacing={2} marginTop={3}>
        {data?.map(i => (
            <Grid size={{ xs: 12, sm: 6, md: 4}} key={i.id}>
                <Card>
                    <CardMedia component="img" height={200} image={!i.images[0] ? `http://localhost:8093/item-images/temp/SStemp.png` : `http://localhost:8093${i.images}`}></CardMedia>
                    <CardHeader title={i.subject} />
                    <CardContent>
                        <Typography variant="body1">{i.subject}</Typography>
                        <Typography variant="body2" >{i.price}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
    </>
    );
}

export default Items;