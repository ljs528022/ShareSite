import { Card, CardContent, CardHeader, CardMedia, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Pagination, Select, Typography } from "@mui/material";
import { DeleteButton, EditButton, ListContextProvider, useListContext, useListController } from "react-admin";
import { useToast } from "../../util/ToastContext";
import { useState } from "react";

const Items = () => {
    const controlProps = useListController({ 
        resource: "items",
        sort: { field: "id", order: "DESC" },
        pagination: { page: 1, perPage: 6 },
    });

    return (
    <ListContextProvider value={controlProps}>
        <GetItemList />
        <ItemCard />
    </ListContextProvider>
    );
};

const GetItemList = () => {
    const { data, sort, setSort, page, setPage, perPage, setPerPage, total } = useListContext();
    
    const [ selectedItem, setSelectedItem ] = useState(null); 

    const handleSortChange = (e) => {
        const [field, order] = e.target.value.split(",");
        setSort({ field, order });
    };

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
        setPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(total / perPage);

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
                    value={`${sort.field},${sort.order}`}
                    onChange={handleSortChange}
                    label="정렬"
                >
                    <MenuItem value="id,DESC">최신</MenuItem>
                    <MenuItem value="id,ASC">과거</MenuItem>
                    <MenuItem value="price,DESC">높은가격</MenuItem>
                    <MenuItem value="price,ASC">낮은가격</MenuItem>
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
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={24}>24</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                </Select>
            </FormControl>
        </Grid>
    </Grid>

    {/* 상품 카드 리스트 */}
    <Grid container spacing={2} marginTop={3}>
        {data?.map(i => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i.id}>
            <div onDoubleClick={() => setSelectedItem(i)} style={{cursor: "pointer"}}>
                <Card>
                    <CardMedia component="img" height={200} image={!i.images[0] ? `http://localhost:8093/item-images/temp/SStemp.png` : `http://localhost:8093${i.images[0].imgUrl}`}></CardMedia>
                    <CardHeader title={i.subject} />
                    <CardContent>
                        <Typography variant="body1">{i.subject}</Typography>
                        <Typography variant="body2" >{i.price}</Typography>
                    </CardContent>
                </Card>
            </div>
            </Grid>
        ))}
    </Grid>

    {selectedItem && <ItemCard item={selectedItem} onClose={() => setSelectedItem(null)}/>}

    <Grid container justifyContent="center" marginTop={4}>
        <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            />
    </Grid>
    </>
    );
}

const ItemCard = ({ item, onClose }) => {
    if(!item) return null;

    const images = item.images;

    return (
        <div style={{position: "fixed", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "5px", padding:"20px", backgroundColor: "#ccc", width: "95.5%", height: "70%", zIndex: 1}}>
            <ImageList cols={images.length} gap={10} style={{margin: "0 auto", justifyItems: "center"}}>
                {images.length > 0 ? images.map((img) => (
                    <ImageListItem key={img.imageKey}>
                        <img style={{width: "300px", height: "180px"}} src={`http://localhost:8093${img.imgUrl}`} loading="lazy" />
                    </ImageListItem>
                ))
                :
                <ImageListItem>
                    <img src={`http://localhost:8093/item-images/temp/SStemp.png`} loading="lazy" />
                </ImageListItem>
                }
            </ImageList>
            <div style={{width: "70%", margin: "50px auto", border: "1px solid rgba(0,0,0,0.5)"}}></div>
            <Typography variant="h4" marginTop={3}>{item.subject}</Typography>
        </div>
    );
}

export default Items;