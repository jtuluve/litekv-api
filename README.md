# Key-Value Store API

Simple REST API for storing and retrieving key-value pairs. Every route returns text and every route is GET.


## Usage

1. Create an app to get an App ID from [https://litekv-api-production.up.railway.app/](https://litekv-api-production.up.railway.app/)
2. Use the App ID to store/retrieve values
3. Use `inc`/`dec` for counters

That's it!

> [!Tip]
> Use the [LiteKV](https://www.npmjs.org/package/litekv) library to easily access the api in a js environment.


> [!Warning]
> The api has global ratelimit. If you want to avoid it, you are free to host a copy of this api by yourself.

## API Endpoints

### Create App

```curl
GET /api/createApp
```

Returns a new App ID as plain text.

### Get Value

```curl
GET /api/getVal/{APPID}/{KEY}
```

Returns the value as plain text. Returns empty string if not found.

### Set Value

```curl
GET /api/setVal/{APPID}/{KEY}/{VALUE}
```

Returns `true` if successful, `false` otherwise.

### Delete Value

To delete a value, simply call setVal without value.

```curl
GET /api/setVal/{APPID}/{KEY}
```

Returns `true` if successful, `false` otherwise.

### Increment

```curl
GET /api/inc/{APPID}/{KEY}
```

Returns `true` if successful, `false` otherwise.

### Decrement

```curl
GET /api/dec/{APPID}/{KEY}
```

Returns `true` if successful, `false` otherwise.

## Quick Example

```curlbash
# Create an app
curl /api/createApp
# Returns: abcde12345

# Set a value
curl /api/setVal/abc123/counter/5
# Returns: true

# Increment it
curl /api/inc/abc123/counter
# Returns: true

# Get the value
curl /api/getVal/abc123/counter
# Returns: 6
```
