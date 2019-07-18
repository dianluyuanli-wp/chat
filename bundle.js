import webpack from 'webpack';
import proWebpackConfig from './webpack.pro.config';

webpack(proWebpackConfig).run((err, stats) => {
    if (err) {
        console.log(err, 'isError');
    }
    if (stats.hasErrors()) {
        console.log(err, "statue");
    }
});