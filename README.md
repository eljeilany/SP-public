# SP
We aim to predict the sails of a sub_class for a certain day using the sails data from the previous 60 to 90 days.
And thus reduce the chance of a shortage or excess of supply taking place.

# Steps :
## Preprcessing the data (prepare_crf.js)
 In this step we aggregate the quantity sold of each sub_class over the span of each day in each hypermarket.
 we then out a csv file by bhypermarket by sub_class containing this aggregated data( HYPERMARKET_NAME_SUB8CLASS.csv )
 IE: CARREFOUR_BOISSEUIL_AGRUMES_BIO_CONDIT.csv
 The files starting with CARREFOUR_* represent the output of this file.

## Training and predicting.
### the file (predictions day by day.ipynb) contains the code for training and teszting the model.
