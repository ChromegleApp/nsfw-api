import {Controller, Post} from 'simple-ts-express-decorators';
import multer, {memoryStorage} from 'multer';
import {Request, Response} from 'express';
import {NsfwImageClassifier} from 'app/NsfwImageClassifier';
import rateLimit from 'express-rate-limit';

const upload = multer({storage: memoryStorage()});

/**
 * Prevent user spam
 */
const userRateLimitMinute = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (request) => `${request.headers['x-forwarded-for'] || request.ip}`
});

/**
 * Prevent global spam
 */
const globalRateLimitMinute = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: () => '1'
});


@Controller()
export class NsfwController {
  classifier: NsfwImageClassifier;

  constructor() {
    this.classifier = new NsfwImageClassifier();
  }

  @Post('/classify', upload.single('image'), userRateLimitMinute, globalRateLimitMinute)
  async classify(request: Request, response: Response) {

    if (request.headers['origin-authority'] !== 'Chromegle') {
      return response
        .status(400)
        .json({error: 'No permission'});
    }

    if (!request.file) {
      return response
        .status(410)
        .json({error: 'Specify image'});
    }

    const data = await this.classifier.classify(request.file.buffer);

    return response.json(data);
  }

}
