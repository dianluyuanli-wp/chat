import webpack from 'webpack';
import proWebpackConfig from './webpack.pro.config';

const compiler = webpack(proWebpackConfig);
let begin, end;
compiler.hooks.compile.tap('begin', () => {
    begin = new Date();
    console.info(`Compiling begin at ${begin}...`);
});

compiler.hooks.done.tap('end', stats => {
    end = new Date();
    console.info(`Compiling end at ${end}, all time consumption ${(end.getTime() - begin.getTime()) / 1000}s...`);
});
compiler.run((err, stats) => {
    if (err) {
        console.log(err, 'isError');
    }
    if (stats.hasErrors()) {
        console.log(err, "statue");
    }
});