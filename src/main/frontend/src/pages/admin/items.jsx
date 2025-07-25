import { Box, Button, Card, CardContent, CardHeader, CardMedia, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import { ListContextProvider, useDataProvider, useListContext, useListController } from "react-admin";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useToast } from "../../util/ToastContext";
import { useNavigate } from "react-router-dom";

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
    const dataProvider = useDataProvider();
    const navigate = useNavigate();
    
    const [ selectedItem, setSelectedItem ] = useState(null);

    const [ modify, setModify ] = useState(false);
    const [ editedData, setEditedData ] = useState("");

    const handlers = {
        modify,
        setModify,
        editedData,
        setEditedData,
        navigate,
    }

    const { showToast } = useToast();

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

    {selectedItem && <ItemCard item={selectedItem} onClose={() => setSelectedItem(null)} dataProvider={dataProvider} handlers={handlers} showToast={showToast}/>}

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

const ItemCard = ({ item, onClose, handlers, dataProvider, showToast }) => {
    useEffect(() => {
        if(!item) return;

        setEditedData({
            subject: item.subject,
            content: item.content,
        })
    }, [item]);

    if(!item) return;

    const { modify, setModify, editedData, setEditedData, navigate } = handlers;

    const handleTextField = (e) => {
        const { id, value } = e.target;
        setEditedData(prev => ({...prev, [id]: value }));
    }

    const cancelModify = () => {
        setEditedData(prev => ({ ...prev,
            subject: item.subject,
            content: item.content,
            itemtype: item.itemtype,
            purtype: item.purtype,
            tradestatus: item.tradestatus,
        }));
        setModify(false);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        console.log(item.id);
        try {
            await dataProvider.update("items", {
                id: item.id,
                data: {
                    subject: editedData.subject,
                    content: editedData.content,
                },
            });

            alert("상품 수정 완료");
            navigate(0);
        } catch {
            showToast("상품 수정 실패", "error");
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            await dataProvider.delete("items", { id: item.id });

            alert("상품 삭제 완료");
            navigate(0);
        } catch {
            showToast("상품 삭제 성공", "error");
        }
    }

    const images = item.images;

    return (
    <>
        <div style={{position: "fixed", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px", top: "100px", padding:"20px", backgroundColor: "#ccc", width: "95.5%", height: "85%", overflow: "auto", zIndex: 1}}>
            <button type="button" onClick={onClose} style={{width: "100%", textAlign: "right", cursor: "pointer"}}><FaTimes size={25} /></button>
            <ImageList cols={images.length} gap={10} style={{margin: "0 auto", justifyItems: "center"}}>
                {images.length > 0 ? images.map((img) => (
                    <ImageListItem key={img.imageKey}>
                        <img style={{width: "300px", height: "180px"}} src={`http://localhost:8093${img.imgUrl}`} loading="lazy" />
                    </ImageListItem>
                ))
                :
                <ImageListItem>
                    <img style={{width: "300px", height: "180px"}} src={`http://localhost:8093/item-images/temp/SStemp.png`} loading="lazy" />
                </ImageListItem>
                }
            </ImageList>
            <div style={{width: "70%", margin: "40px auto", border: "1px solid rgba(0,0,0,0.5)"}}></div>
            <Grid container spacing={0} mt={2}>
                <Grid size={{xs: 12, sm: 4}}>
                    {!modify ?
                    <>
                    <Typography variant="h7" padding={2}>- Subject -</Typography>
                    <Typography variant="h5">{item.subject}</Typography>
                    </>
                    :
                    <TextField fullWidth id="subject" type="text" value={editedData.subject} label="- Subject -" onChange={handleTextField} />
                    }
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- Category -</Typography>
                    <Typography variant="h5">{item.cateKey}</Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- Price -</Typography>
                    <Typography variant="h5">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " 원"}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- ItemType -</Typography>
                    <Typography variant="h5">{item.itemtype === "NEW" ? "신품" : "중고"}</Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- Trade Type -</Typography>
                    <Typography variant="h5">
                        {item.purtype === "POST" ? "택배" :
                        item.purtype === "TRADE" ? "직거래" : "둘다 가능"}
                    </Typography>   
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- Trade Status -</Typography>
                    <Typography variant="h5">{item.tradestatus ? "거래 완료" : "거래 중"}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- UserKey -</Typography>
                    <Typography variant="h5">{item.userKey}</Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- View Count -</Typography>
                    <Typography variant="h5">{item.viewcnt}</Typography>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- Write Date -</Typography>
                    <Typography variant="h5">{item.writeDate}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={3}>
                <Grid size={{xs: 12, sm: 4}}>
                    <Typography variant="h7" padding={2}>- Content -</Typography>
                    {!modify ?
                    <Typography variant="h5">{item.content}</Typography>
                    :
                    <TextField fullWidth id="content" value={editedData.content} label="- Content -" onChange={handleTextField} />
                    }
                </Grid>
            </Grid>

            <Box mt={2}>
                {!modify ?
                <>
                <Button variant="contained" onClick={() => setModify(true)}>수정하기</Button>
                <Button variant="outlined" sx={{marginLeft: "10px"}} color="error" onClick={handleDelete}>상품 삭제</Button>
                </>
                :
                <>
                <Button variant="contained" onClick={handleUpdate}>수정 완료</Button>
                <Button variant="outlined" sx={{marginLeft: "10px"}} color="error" onClick={cancelModify}>수정 취소</Button>
                </>
                }
            </Box>
        </div>
    </>
    );
}

export default Items;