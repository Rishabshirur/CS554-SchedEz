FROM node:slim

# Create app directory
WORKDIR /usr/src/app

ENV SERVER_URL='mongodb://host.docker.internal:27017/'
ENV DATABASE='CS_554-Final_Project'
ENV LOCAL_IP="127.0.0.1"
# ENV REDIS_HOST="my-redis-service" 
# ENV REDIS_PORT="6379"
# ENV TYPE="service_account"
# ENV PROJECT_ID="dsatalks-b8533"
# ENV PRIVATE_KEY_ID="f8d716833fb1631670f9c0ded84a380bcd25b235"
# ENV PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzs07y9bEyFgt8\nZrfmSKvg/B/aXhoeARez7s4BIaG/vqrxuE1190wO2Gl2YLrsn9qdfA5GN7bqegEI\nmHyr7HXu7nFuxxkID1QtSb7C16YPIJfzYQzrOptW8dQSAnaSHY3SdAgJ+DpgR6gA\n2q1mz9g1OWHXw7bzyZUkqxWAX8hkFcyr/hdvrgLRAPM8ejmSfg9SShPwilpgRHag\nJ0FaNMihnFwrTYGt0KknrbIFL+xqE4k4ElNLtqHosNeLG7SmYSDK0nvysaYjhp1G\nsIBSnEyaAgpTVl6S1/az6jiBoLyXm2i6vUcoYiWFPqxjlWr16BICkcVe/DhRHy2h\nufxqkMO/AgMBAAECggEAECisYupB9qbcfeFqDFH2QWMakCh3FmydujHb92ZpT5SF\nyvpPiNnlzniaXyk1QH2NYIJHxvulPfIeRqzDmogcVhG97yqwbwpF1P61IdCCH7PG\nxigGITQ3b2WL3toMLyPA3YROjBWfVjS2AEGpvGgt4SIEUNfKC05R/tFIO9ohFb1o\ntoYpQAqfYRCPlfu/K9SlfbjnqmqeD+qwh39+nSet2mJ0cD03uMh8oD0CZOKRfkP6\nWFAjR+zdT/fLQyfNxFG0NkRpYYmb52rTH3keQpFDGG9IzjsbFRUVduQhO/Esc6TV\nPbGBgyi66hKiiq9aztHDazCRLgWczxNcXwFTjnWnwQKBgQDpMo3X1aLFAB5huxVr\nsJh7U3jaX6J7N9vNDDBo35Fmqjed7gyGNDzng5wekt45crjD3RPKAB5XgeFSnrTk\nChazpFOnUI0A+QtN+yVXZi3nuzp/Il6vUToVzPg4gufds12IoXeHM09muGr+ye5o\nZK/dsmIWeoitg/ny9pitLw8/QQKBgQDFRZr5ccBgNmDXozvRqIjmKS7k2AMfxC52\nUy/MS3p7woN0rBWnCNOS7Pv6/3rBW//YjPOBc5yF4OFKbR5/ZqwhDxj4tJOhSpiB\ny7mYL/rMys844PgXRdZxWy4HYHABIzewrsLP81qis/DWAeJfDQ6beJuhXxPQkLZ7\nGJVdSZJC/wKBgQDjzoUOch7eQC1t36sfVpa+814+ReqeYIUSnHO2H6EVH/fRCjml\n6OYObF1Y6LS6fj3M6O1qCg+aAMEzSuL/WnOu7jriWihE6QWIGm3yIVl65UZR6CuD\nLOCHZ4KdAhSsWYpn7QStSQyqFkI/wNhrluDOvHJh7zYR+7lzBj9D/5LvgQKBgQCT\nbxYH36/7OCjggKqwYtkNyzG07oxHLYPcAwfyE2cTH6jHheUY1UvqvxsD1/SSloN8\nALvsv873b75wtWTZqo5ylqn/FlZPcUTRnMS0rQcwD1MYG2rPWe6PAapA8R5Ee2Gf\ntrz6VdIjT4BrMTVR/JwyLc2CqWBRvBXlodXfxqB9WQKBgDp8d4ekH7+iE5DAUdJU\ne9hMExtRCL0+KpVDM9zgzPkdU8AM9wxm5zp90xOWSNWpL4ArISw/fl2PHjQq/WBR\nEjvzw6UunihHnZO22Xc0hKv+7OG5DsPbVjLNTBSUHo0fpwLC4R3/gIBw6+RyoOeX\nk6GBkxm7v3nVGYv13XIOdoOr\n-----END PRIVATE KEY-----\n"
# ENV CLIENT_EMAIL="firebase-adminsdk-7m4hk@dsatalks-b8533.iam.gserviceaccount.com"
# ENV CLIENT_ID="100051521207079659643"
# ENV AUTH_URI="https://accounts.google.com/o/oauth2/auth"
# ENV TOKEN_URI="https://oauth2.googleapis.com/token"
# ENV AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
# ENV CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7m4hk%40dsatalks-b8533.iam.gserviceaccount.com"
# ENV UNIVERSE_DOMAIN="googleapis.com"
# ENV ACCESS_KEY="AKIA23ETLKVFJPZKGZ5G"
# ENV SECRET_ACCESS_KEY="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"
# ENV AWS_BUCKET_NAME="dsatalksaws"
# ENV AWS_REGION="us-east-1"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
RUN apt-get update && apt-get install -y imagemagick
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]