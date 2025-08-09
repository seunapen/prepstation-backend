const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const School = require('../models/School');

function loadSeedFile(name){
  const p = path.join(__dirname, '..', 'data', name);
  if(!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

async function upsertMany(Model, data, keyField){
  if(!data || !Array.isArray(data) || data.length===0){
    logger.info(`${Model.modelName}: No seed data file or empty array`);
    return { inserted:0, updated:0 };
  }
  let inserted = 0, updated = 0;
  for(const rec of data){
    try{
      const filter = {};
      filter[keyField] = rec[keyField];
      const existing = await Model.findOne(filter);
      if(!existing){
        await Model.create(rec);
        inserted++;
        logger.info(`${Model.modelName}: Inserted ${JSON.stringify(rec[keyField])}`);
      } else {
        let changed = false;
        for(const k of Object.keys(rec)){
          if(k === '_id') continue;
          const a = (existing[k] instanceof Date) ? existing[k].toISOString() : existing[k];
          const b = (rec[k] instanceof Date) ? new Date(rec[k]).toISOString() : rec[k];
          if(String(a) !== String(b)){
            changed = true; break;
          }
        }
        if(changed){
          await Model.updateOne(filter, { $set: rec });
          updated++;
          logger.info(`${Model.modelName}: Updated ${JSON.stringify(rec[keyField])}`);
        }
      }
    }catch(err){
      logger.error(`${Model.modelName}: Error upserting ${JSON.stringify(rec[keyField])} - ${err.message}`);
    }
  }
  logger.info(`${Model.modelName}: Inserted=${inserted} Updated=${updated}`);
  return { inserted, updated };
}

async function seedDatabase(){
  logger.info('=== Seeding Started ===');
  const users = loadSeedFile('users.json');
  const courses = loadSeedFile('courses.json');
  const lessons = loadSeedFile('lessons.json');
  const quizzes = loadSeedFile('quizzes.json');
  const schools = loadSeedFile('schools.json');

  await upsertMany(Course, courses, 'title');
  const courseMap = {};
  if(courses) for(const c of courses){
    const doc = await Course.findOne({ title: c.title });
    if(doc) courseMap[c.title] = doc._id;
  }
  if(lessons){
    const lessonsPrepared = lessons.map(l => ({ ...l, course: courseMap[l.courseTitle] || null, courseTitle: undefined }));
    await upsertMany(Lesson, lessonsPrepared, 'title');
  }
  if(quizzes){
    const quizzesPrepared = quizzes.map(q => ({ ...q, course: courseMap[q.courseTitle] || null, courseTitle: undefined }));
    await upsertMany(Quiz, quizzesPrepared, 'title');
  }
  await upsertMany(User, users, 'email');
  await upsertMany(School, schools, 'name');
  logger.info('=== Seeding Completed ===');
}

module.exports = seedDatabase;

if(require.main === module){
  const mongoose = require('mongoose');
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/prepstation';
  mongoose.connect(MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
    .then(async () => {
      await seedDatabase();
      mongoose.disconnect();
    })
    .catch(err => { logger.error('Seeding failed: ' + err.message); process.exit(1); });
}
