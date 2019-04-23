const exchange = 'yourExchangeName';
const queue = 'yourQueueName';
const queueBinding = 'yourQueueBindingName';

require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
        if (err != null) bail(err);
        consumer(conn);
    });

function bail(err) {
    console.error(err);
    process.exit(1);
}

// Message consumer
function consumer(conn) {
    var ok = conn.createChannel(on_open);
    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
        ch.assertQueue(queue, { durable: true });
        ch.bindQueue(queue, exchange, queueBinding);
        ch.consume(queue, function (msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
            }
        });
    }
}