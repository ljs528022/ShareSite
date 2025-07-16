import { Grid } from "@mui/material";
import { useListContext } from "react-admin";

const Items = () => {
    const { data } = useListContext();

    if(!data) return <div>Loading...</div>;
    console.log(data);
    
    return (
    <Grid container spacing={2}>

    </Grid>
    );
}

export default Items;