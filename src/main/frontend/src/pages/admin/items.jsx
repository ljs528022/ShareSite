import { Card, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { List, useListContext } from "react-admin";

const Items = () => {

    return (
    <List>
        <GetItemList />
    </List>
    );
};

const GetItemList = () => {
    const { data } = useListContext();

    const img = !data?.images ? "/item-images/temp/SStemp.png" : `http://localhost:8093${data.images}`;

    return (
    <>
    <Typography variant="h5">{`총 상품 : ${data?.length} 개`}</Typography>
    <Grid spacing={2} textAlign={"right"}>
        
    </Grid>
    <Grid container spacing={2} marginTop={3}>
        {data?.map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4}} key={i.itemKey}>
                <Card>
                    <CardMedia src={img}></CardMedia>
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