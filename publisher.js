const exchange = 'yourExchangeName';
const queue = 'yourQueueName';
const queueBinding = 'yourQueueBindingName';

require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
        if (err != null) bail(err);
        publisher(conn);
    });

function bail(err) {
    console.error(err);
    process.exit(1);
}

// Publish message
function publisher(conn) {
    conn.createChannel(on_open);
    function on_open(err, ch) {
        if (err != null) bail(err);
        const headers = { 'x-delay': 10000 };
        ch.publish(exchange, queueBinding, Buffer.from('hello 10sn from past'), { headers });
    }
}
