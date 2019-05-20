function verifyPayloadType(request, type){
    return request.body.type === type;
}

exports.verifyPayloadType = verifyPayloadType;